'use client'
import { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: ''
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        console.log(formData);

        const response = await fetch('http://localhost:3002/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
            })
        });
        console.log(1)
        const data = await response.json();
        console.log(2)
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
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <button type="submit">Register</button>
          </form>
      </div>
  );
}