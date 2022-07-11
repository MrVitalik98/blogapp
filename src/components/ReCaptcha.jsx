import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'


const ReCaptcha = ({ setToken, reRef }) => {
  return <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onChange={value => setToken(value)}
          className="mx-auto"
          ref={reRef}
        />
}


export default ReCaptcha