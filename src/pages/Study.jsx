import React, { useState } from 'react'
import {Button, Container, Form } from "react-bootstrap";


function Study() {
    const [blog,setBlog]=useState("")
    const [title,setTitle]=useState("")
    const [full,setFull]=useState([])
    const addFull=(blog)=>{
      setFull((prev)=>[...prev,blog])
    }
    const handle=(e)=>{
e.preventDefault();
      const fullb={
        id:Date.now(),
        title,
        blog
      }
        setFull((prev)=>[...prev,fullb]
      
      )
        setTitle("")
        setBlog("")
        
    }
  return (
    <div>
       <Form onSubmit={handle}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Write your blog post here..."
              rows={10}
              value={blog}
              onChange={(e) => setBlog(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Create
            </Button>
          </div>
        </Form>
        {full.map((item)=>(
          <div key={item.id}>
            <div>{item.title} </div>
          </div>
        ))}
    </div>
  )
}

export default Study