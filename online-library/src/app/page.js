'use client'
import { useState } from "react";
import Register from "./components/register.js";
import Login from "./components/login.js";

const Page = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div>
            {isLogin ? <Login /> : <Register />}
            <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Register" : "Login"}
                </button>
            </p>
        </div>
    );
};

export default Page;