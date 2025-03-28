import React from 'react'
import SignIn from './SignIn'

const Home = () => {
    return (
        <div className="welcome">
            <p>Welcome to AllIN1 Messenger</p>
            <div className="welcome-btns">
                <SignIn />
            </div>
        </div>
    )
}

export default Home