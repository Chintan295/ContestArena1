import React from 'react'
import {getCookie,refresh_token,Logout} from './Login'
import axios from 'axios'
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import './Gotocontest.css'
import './Template.css'
import './Text.css'
class Gotocontest extends React.Component{ 
    constructor(){
        super();
        this.state={contestList:[],filteredList:[],inputvalue:'',Go:'',contest:{},token:""}
        this.getContestList=getContestList.bind(this);
        this.getContestList();
    }
    change=(e)=>{
        e.persist()
        if(this.state.contestList.length==0)
            this.getContestList();
        const filteredDataList = this.state.contestList.filter(item => item["code"].toLowerCase().startsWith(e.target.value.toLowerCase())|| item["name"].toLowerCase().startsWith(e.target.value.toLowerCase()) );
        this.setState({filteredList: filteredDataList});
        this.setState({inputvalue: e.target.value});
    }
    select=(e)=>{
        e.persist();
        var name=e._targetInst.stateNode.innerText;
        var item;
        for (item of this.state.filteredList) {
            if(item.name.toString()==e._targetInst.stateNode.innerText)
            var contestObject=item;
        }  
        this.setState({filteredList:[],inputvalue:name,contest:contestObject});
    }
    logout=()=>{
        Logout();
        this.setState({});
    }
    render(){
        if(getCookie('refresh_token')==""){
            return <Redirect to='/my-app'/>;
        }
        refresh_token();
        console.log(this.state.filteredList);
        var nameWiseList=(this.state.filteredList.map((item)=>item.name.toString()));
        return(
            <div className="background center">
                <button className="b1 topright" onClick={this.logout}>Logout</button>
                <div>
                    <p className="head1">Enter a constest name or code :</p> 
                    <input type="text" onChange={this.change} value={this.state.inputvalue}></input>&emsp;
                    <Link to={'/my-app/contest/'+this.state.contest.code}><button className="b1"> Go</button></Link>
                    {(this.state.filteredList!=null&&this.state.inputvalue!=''?
                    <ul>
                        {nameWiseList.map((item,i)=> <li key={i}  onClick={this.select}>{item}</li>)}
                    </ul>:<ul></ul>)}
                </div>
            </div>
        );
    }
}
function getContestList(){
    axios.get(`https://api.codechef.com/contests`,
                {headers:{'Content-Type': 'application/json',
                           'Accept': 'application/json',
                           'Authorization': 'Bearer '+ getCookie('token')
                          }
    })
  .then(res => {
      this.setState({contestList:res.data.result.data.content.contestList});
      console.log(res.data.result.data.content.contestList);
  })
  .catch(function (error) {
    console.log(error.message);
  });
}
export default Gotocontest;
