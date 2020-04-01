import React from 'react'
import axios from 'axios'
import {Redirect, Link} from 'react-router-dom'
import './Text.css'

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state={token:getCookie('token'),code:this.getUrlParams()["code"],clicked:false};
        if(this.state.code!=null&&this.state.token=='')
          this.getAuthToken();
    }
    getUrlParams=()=> {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
          vars[key] = value;
        });
        return vars;
    }
    getPermission= () => {
        this.setState({clicked:true});
        window.location.replace("https://api.codechef.com/oauth/authorize?response_type=code&client_id=b0dc306a0d6b2de128848d06a7ab264d&state=xyz&redirect_uri=http://localhost:3000/my-app");
    }
    getAuthToken=()=>{
        let data={ "grant_type": "authorization_code",
                    "code":this.state.code,
                   "client_id":"b0dc306a0d6b2de128848d06a7ab264d",
                   "client_secret":"514b2f072a880804bbf5fadd7a36f636",
                   "redirect_uri":"http://localhost:3000/my-app" 
                }
        axios.post(`https://api.codechef.com/oauth/token`,
                    data,
                    {headers:{'Content-Type': 'application/json','Accept': 'application/json'}
        })
        .then(res => {
          setCookie('token',res.data.result.data["access_token"],res.data.result.data["expires_in"]);
          setCookie('refresh_token',res.data.result.data["refresh_token"],864000);
          this.setState({token:res.data.result.data["access_token"]});
          console.log(res);
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }

    check= ()=>{
        if(this.state.code==null)
          this.getPermission();
    }

    render(){ 
        if(this.state.token!='')
          return <Redirect to='/my-app/Gotocontest'/>
        else if(this.state.clicked==false&&this.state.code==null){
          return (
            <div className="background">
                <div className="head">
                  Welcome to Contest Arena!
                </div>
                <div className="Login">
                  <button onClick={this.check}> Login with Codechef </button>
                </div>
            </div>);
        }
        else{
          return <div className="background">
                    <div className="wrap">
                        <div className="spinner-wrap">
                            <div className="spinner">
                                <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
                            </div>
                        </div>
                    </div>
            </div>
        }
    }
}
function setCookie(cname, cvalue, exSec) {
    var d = new Date();
    d.setTime(d.getTime() + exSec*1000);
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export function refresh_token(){
  var refresh_token=getCookie("refresh_token");
  if(getCookie('token')!="") return;
  let data={"grant_type":"refresh_token" ,
            "refresh_token":refresh_token, 
            "client_id":"b0dc306a0d6b2de128848d06a7ab264d",
            "client_secret":"514b2f072a880804bbf5fadd7a36f636"}
        axios.post(`https://api.codechef.com/oauth/token`,
                    data,
                    {headers:{'Content-Type': 'application/json','Accept': 'application/json'}
        })
        .then(res => {
          setCookie('token',res.data.result.data["access_token"],res.data.result.data["expires_in"]);
          setCookie('refresh_token',res.data.result.data["refresh_token"],86400000000);
        })
        .catch(function (error) {
          console.log(error.message);
        });
}
export function Logout(){
  setCookie('token',"0",0);
  setCookie('refresh_token',"0",0);
}
export default Login;