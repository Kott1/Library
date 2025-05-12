'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Login () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3002/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email,
                    password
                }),
            });

            const data = await response.json();
            if (response.ok && !data.error) {
                const isAdmin = email === 'admin@gmail.com' && password === 'admin';
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('isAdmin', JSON.stringify(isAdmin));

                alert('User signed in successfully');

                router.push('/pages/home');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error login user');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};