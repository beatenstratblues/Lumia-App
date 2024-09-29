import React from 'react'
import LoginBox from '../components/LoginBox'
import Footer from '../components/Footer'

const IndexPage = () => {
  return (
    <div className='indexPage'>
      <div className='heroImage'>
        <div>INSPIRE</div>
      </div>
      <div className='loginPane'>
        <LoginBox/>
      </div>
      <Footer/>
    </div>
  )
}

export default IndexPage