'use client'
import { useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

        const response = await fetch('http://localhost:3002/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: name,
            email: email,
            password: password
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert('User registered successfully!');
        } else {
            alert(data.error || 'Registration failed');
        }
        } catch (error) {
            console.error('Error:', error);
            alert('Error registering user');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Register</button>
          </form>
        </div>
    );
}