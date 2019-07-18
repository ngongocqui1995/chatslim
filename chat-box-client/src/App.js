import './App.css';
import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import moment from "moment"
import fetchData from "./Api/Api"

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: "",
      isModalLogin: true,
      content: [],
      message: ""
    }
  }

  scrollBottomChatBox = () => {
    try{
      var objDiv = document.getElementById("chatbox");
      objDiv.scrollTop = objDiv.scrollHeight;
    }catch(err){
      console.log(err)
    }
  }

  chatBox = async(message) => {
    let result = await fetchData._phan_Hoi(message)
    let { traLoi } = result

    let date = new Date()
    let content = this.state.content
    content.push({ date: date, name: "slim", message: traLoi })

    this.setState({ content: content })
    this.scrollBottomChatBox()
  }

  handleClickOpen = (e) => {
    e.preventDefault()

    this.setState({ isModalLogin: true, name: "", content: [] })
  }

  handleClose = () => {
    this.setState({ isModalLogin: false })
  }

  onChangeName = (e) => {
    e.preventDefault()
    this.setState({ name: e.target.value })
  }

  sendMessage = async(e) => {
    e.preventDefault()

    let date = new Date()
    let name = this.state.name
    let message = this.state.message 
    let content = this.state.content
    content.push({ date: date, name: name, message: message })

    this.setState({ content: content, message: "" })
    this.scrollBottomChatBox()

    await this.chatBox(message)
  }

  onChangeMessage = (e) => {
    this.setState({ message: e.target.value })
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (this.state.name === "") return

      this.handleClose()
    }
  }

  render() {
    let { name, isModalLogin, message, content } = this.state

    if (isModalLogin) {
      return (
        <Dialog
          open={isModalLogin}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Đăng nhập"}</DialogTitle>
          <DialogContent>
            <TextField
              onKeyDown={this._handleKeyDown}
              value={name}
              onChange={this.onChangeName}
              autoFocus
              margin="dense"
              id="name"
              label="Tên"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      )
    } else {
      return (
        <>
          <div id="wrapper">
            <div id="menu">
                  <p style={{fontSize: 14}} className="welcome">{`Xin chào, `}<b>{name}</b></p>
                  <p className="logout">
                    <a onClick={this.handleClickOpen} style={{fontSize: 14}} id="exit" href={"/"}>Thoát</a>
                  </p>
                  <div style={{clear: "both"}}></div>
              </div>
              
              <div id="chatbox">
                {
                  content.map((row, index) => (
                    <div key={index} className='msgln' style={{fontSize: 14}}>
                      {`(${moment(row.date).format("HH:mm:ss")}) `}
                      <b>{`${row.name}`}</b>
                      {`: ${row.message}`}
                    </div>
                  ))
                }
              </div>
              
              <form name="message" action="">
                  <input name="usermsg" value={message} onChange={this.onChangeMessage} type="text" id="usermsg" size="63" />
                  <input style={{fontSize: 14}} name="submitmsg" onClick={this.sendMessage} type="submit" id="submitmsg" value="Gửi" />
              </form>
          </div>
        </>
      )
    }
  }
}


export default App;
