import { useDispatch, useSelector } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaPen,
  FaPencilAlt,
  FaTimes,
  FaPlus,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import {
  UPLOAD_AVATAR,
  EDIT_USER_DATA,
  DELETE_AVATAR,
} from "../graphql/user/mutations";
import { openDeleteAvatarModal } from "../app/features/modals/deleteAvatar/deleteAvatarSlice";
import { GET_ALL_POSTS, GET_USER_POSTS } from "../graphql/post/queries";
import DeleteAvatarModal from "../components/modals/DeleteAvatar";
import { showAlert } from "../app/features/alert/alertSlice";
import { setUser } from "../app/features/login/loginSlice";
import { imageValidator } from "../utils/validator";
import { GET_USER } from "../graphql/user/queries";

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef("");
  const [file, setFile] = useState();
  const [aboutMe, setAboutMe] = useState("");
  const [isActiveTextArea, setActiveTextArea] = useState(false);
  const { category: category1, count } = useSelector(state => state.allPosts);
  const { category: category2 } = useSelector(state => state.userPosts);
  const [isActiveEditAvatarBtn, setActiveEditAvatarBtn] = useState(false);

  const {
    user: { fullname, avatar, about, _id },
  } = useSelector(state => state.auth);

  const refetchQueries = [
    {
      query: GET_USER,
      variables: { userId: _id },
    },
    {
      query: GET_ALL_POSTS,
      variables: { count, category: category1 },
    },
    {
      query: GET_USER_POSTS,
      variables: { category: category2 },
    },
  ];

  const [getUser, { data }] = useLazyQuery(GET_USER);

  const [uploadAvatar, { loading: loading1, data: data1 }] = useMutation(
    UPLOAD_AVATAR,
    {
      refetchQueries,
    }
  );

  const [deleteAvatar, { loading: loading2, data: data2 }] = useMutation(
    DELETE_AVATAR,
    {
      refetchQueries,
    }
  );

  const [editUserData, { loading: loading3, data: data3 }] = useMutation(
    EDIT_USER_DATA,
    {
      refetchQueries,
    }
  );

  useEffect(() => {
    getUser({ variables: { userId: _id } });
  }, [_id, getUser]);

  useEffect(() => {
    data?.user && dispatch(setUser(data?.user));
  }, [data?.user, dispatch]);

  useEffect(() => {
    if (
      (data1?.result && data1?.result?.status === "success") ||
      (data2?.result && data2?.result?.status === "success")
    ) {
      setActiveEditAvatarBtn(false);
      !loading1 && !loading2 && setFile("");
    }

    (data1?.result?.status === "error" || data2?.result?.status === "error") &&
      dispatch(showAlert(data1?.result || data2?.result));
  }, [loading1, loading2, data1, data2, dispatch]);

  useEffect(() => {
    data3?.result &&
      data3?.result?.status === "success" &&
      !loading3 &&
      setActiveTextArea(false);
  }, [loading3, data3]);

  useEffect(() => {
    isActiveTextArea && about && setAboutMe(about);
  }, [about, isActiveTextArea]);

  const saveAboutMe = async () => {
    editUserData({ variables: { data: { about: aboutMe } } });
  };

  const handleSelectFile = e => {
    const { status, message, file } = imageValidator([...e.target.files][0], 2);

    if (status && message) {
      dispatch(showAlert({ status, message }));
      return;
    }

    setFile(file);
  };

  const handleUploadAvatar = () => {
    uploadAvatar({ variables: { image: file, imageSize: file.size } });
  };

  return (
    <div className="account-page">
      <input
        type="file"
        className="d-none"
        ref={fileInputRef}
        onChange={handleSelectFile}
        accept="image/png, image/jpg, image/jpeg"
      />

      <div className="user-avatar">
        <img
          src={
            file
              ? URL.createObjectURL(file)
              : avatar || process.env.REACT_APP_DEFAULT_AVATAR
          }
          alt="user-avatar"
          className={`shadow ${file && "blur"}`}
        />

        {file && (
          <div className="operations" style={{ marginLeft: "-50px" }}>
            <button
              className="btn btn-secondary shadow"
              id="cancel-upload-avatar"
              onClick={() =>
                !loading1 && isActiveEditAvatarBtn ? setFile("") : undefined
              }
              disabled={loading1 || !isActiveEditAvatarBtn}
            >
              <FaTimes />
            </button>

            <button
              className="btn btn-success shadow"
              id="upload-avatar"
              onClick={
                !loading1 && isActiveEditAvatarBtn
                  ? handleUploadAvatar
                  : undefined
              }
              disabled={loading1 || !isActiveEditAvatarBtn}
            >
              <FaCheck />
            </button>
          </div>
        )}

        {!file && (
          <>
            <button
              id="select-avatar"
              className={`btn btn-secondary shadow ${
                isActiveEditAvatarBtn && "show"
              }`}
              onClick={() =>
                isActiveEditAvatarBtn && !loading2
                  ? fileInputRef.current.click()
                  : undefined
              }
              disabled={!isActiveEditAvatarBtn || loading2}
            >
              <FaPlus />
            </button>

            <button
              id="remove-avatar"
              className={`btn btn-danger shadow ${
                isActiveEditAvatarBtn && "show"
              }`}
              onClick={() =>
                avatar && isActiveEditAvatarBtn && !loading2
                  ? dispatch(openDeleteAvatarModal())
                  : undefined
              }
              disabled={!avatar || !isActiveEditAvatarBtn || loading2}
            >
              <FaTrash />
            </button>

            {isActiveEditAvatarBtn ? (
              <button
                className="btn btn-dark rounded-circle"
                id="edit-avatar"
                onClick={() =>
                  loading2 ? undefined : setActiveEditAvatarBtn(false)
                }
              >
                <FaTimes />
              </button>
            ) : (
              <button
                className="btn btn-primary rounded-circle"
                id="edit-avatar"
                onClick={() =>
                  loading2 ? undefined : setActiveEditAvatarBtn(true)
                }
              >
                <FaPencilAlt />
              </button>
            )}
          </>
        )}
      </div>

      <div className="user-info">
        <h2 className="user-fullname">{fullname}</h2>
        {!about || isActiveTextArea ? (
          <>
            <div className="form">
              <textarea
                className="form-control"
                placeholder="About Me"
                maxLength={200}
                value={aboutMe}
                onChange={e =>
                  !loading3 ? setAboutMe(e.target.value) : undefined
                }
                disabled={loading3}
              ></textarea>

              <span className="note">Maximum 200 characters</span>
            </div>

            <div className={`btn-group ${!about ? "isEmpty" : ""}`}>
              {about && (
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    !loading3 ? setActiveTextArea(false) : undefined
                  }
                  disabled={loading3}
                >
                  Cancel
                </button>
              )}

              <button
                className="btn btn-success"
                onClick={!loading3 ? saveAboutMe : undefined}
                disabled={loading3}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <div className="user-about">
            <p>{about}</p>

            <button
              id="editAboutOfUser"
              className="btn btn-muted"
              onClick={() => setActiveTextArea(true)}
            >
              <FaPen />
            </button>
          </div>
        )}
      </div>

      <DeleteAvatarModal deleteAvatar={deleteAvatar} />
    </div>
  );
};

export default Profile;
