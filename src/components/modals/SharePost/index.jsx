import React from 'react'
import { Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { 
  EmailShareButton, EmailIcon,
  WhatsappShareButton, WhatsappIcon,
  MailruShareButton, MailruIcon,
  TwitterShareButton, TwitterIcon,
  FacebookShareButton, FacebookIcon,
  TelegramShareButton, TelegramIcon,
  LinkedinShareButton, LinkedinIcon,
  HatenaShareButton, HatenaIcon,
  LivejournalShareButton, LivejournalIcon,
  InstapaperShareButton, InstapaperIcon,
  PinterestShareButton, PinterestIcon,
  PocketShareButton, PocketIcon,
  RedditShareButton, RedditIcon,
  TumblrShareButton, TumblrIcon,
  ViberShareButton, ViberIcon,
  LineShareButton, LineIcon,
  VKShareButton, VKIcon,
  OKShareButton, OKIcon
} from 'react-share'

import { closeSharePostModal } from '../../../app/features/modals/sharePost/sharePostSlice'
import './index.scss'


const SharePost = () => {
  const dispatch = useDispatch()
  const { isShow, post } = useSelector(state => state.modals.sharePost)

  const { _id, image, title } = post

  const url = `${process.env.REACT_APP_BASE_URL}/posts/${_id}`


  return (
    <Modal 
      show={isShow} 
      onHide={() => dispatch(closeSharePostModal())}
      id="share-post-modal"
    >
      <Modal.Body>
        <div className="post">
          <img
            alt={title}
            src={image}
            className="post-image"
          />
  
          <p className="title">{title}</p>
        </div>

        <hr />

        <div className="social">
          <WhatsappShareButton url={url}>
            <WhatsappIcon />
          </WhatsappShareButton>

          <EmailShareButton url={url}>
            <EmailIcon />
          </EmailShareButton>

          <FacebookShareButton url={url}>
            <FacebookIcon />
          </FacebookShareButton>

          <HatenaShareButton url={url}>
            <HatenaIcon />
          </HatenaShareButton>

          <InstapaperShareButton url={url}>
            <InstapaperIcon />
          </InstapaperShareButton>

          <LineShareButton url={url}>
            <LineIcon />
          </LineShareButton>

          <LinkedinShareButton url={url}>
            <LinkedinIcon />
          </LinkedinShareButton>

          <LivejournalShareButton url={url}>
            <LivejournalIcon />
          </LivejournalShareButton>

          <MailruShareButton url={url}>
            <MailruIcon />
          </MailruShareButton>

          <OKShareButton url={url}>
            <OKIcon />
          </OKShareButton>

          <PinterestShareButton url={url}>
            <PinterestIcon />
          </PinterestShareButton>

          <PocketShareButton url={url}>
            <PocketIcon />
          </PocketShareButton>

          <RedditShareButton url={url}>
            <RedditIcon />
          </RedditShareButton>

          <TelegramShareButton url={url}>
            <TelegramIcon />
          </TelegramShareButton>

          <TumblrShareButton url={url}>
            <TumblrIcon />
          </TumblrShareButton>

          <TwitterShareButton url={url}>
            <TwitterIcon />
          </TwitterShareButton>

          <ViberShareButton url={url}>
            <ViberIcon />
          </ViberShareButton>

          <VKShareButton url={url}>
            <VKIcon />
          </VKShareButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default SharePost