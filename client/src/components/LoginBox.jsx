import React from "react";

const LoginBox = () => {
  return <div className="loginBox">
    <div className="logo"></div>
    <form>
        <input type="text" placeholder="Username" className="formInput"/>
        <input type="text" placeholder="Password" className="formInput"/>
        <button className="formButton">Log in</button>
    </form>
    <span>forgot password?</span>
    <div className="or"><div/>or<div/></div>
    <button className="formButton">Create account</button>
  </div>;
};

export default LoginBox;
