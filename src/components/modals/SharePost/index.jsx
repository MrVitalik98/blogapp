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
          <WhatsappShareButton url={url} title={title}>
            <WhatsappIcon />
          </WhatsappShareButton>

          <EmailShareButton url={url} title={title}>
            <EmailIcon />
          </EmailShareButton>

          <FacebookShareButton url={url} quote={title}>
            <FacebookIcon />
          </FacebookShareButton>

          <HatenaShareButton url={url} title={title}>
            <HatenaIcon />
          </HatenaShareButton>

          <InstapaperShareButton url={url} title={title}>
            <InstapaperIcon />
          </InstapaperShareButton>

          <LineShareButton url={url} title={title}>
            <LineIcon />
          </LineShareButton>

          <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon />
          </LinkedinShareButton>

          <LivejournalShareButton url={url} title={title}>
            <LivejournalIcon />
          </LivejournalShareButton>

          <MailruShareButton url={url} title={title}>
            <MailruIcon />
          </MailruShareButton>

          <OKShareButton url={url} title={title}>
            <OKIcon />
          </OKShareButton>

          <PinterestShareButton url={url} title={title}>
            <PinterestIcon />
          </PinterestShareButton>

          <PocketShareButton url={url} title={title}>
            <PocketIcon />
          </PocketShareButton>

          <RedditShareButton url={url} title={title}>
            <RedditIcon />
          </RedditShareButton>

          <TelegramShareButton url={url} title={title}>
            <TelegramIcon />
          </TelegramShareButton>

          <TumblrShareButton url={url} title={title}>
            <TumblrIcon />
          </TumblrShareButton>

          <TwitterShareButton url={url} title={title}>
            <TwitterIcon />
          </TwitterShareButton>

          <ViberShareButton url={url} title={title}>
            <ViberIcon />
          </ViberShareButton>

          <VKShareButton url={url} title={title}>
            <VKIcon />
          </VKShareButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}


export default SharePost