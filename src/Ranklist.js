import React from 'react'
import {getCookie,refresh_token,Logout} from './Login'
import axios from 'axios'
import {Redirect,Link} from 'react-router-dom'
import {getContestDetails} from './Contestpage'
import './Contestpage.css'
import './Loding.css'
class Ranklist extends React.Component{
    constructor(){
        super();
        var url=window.location.href.split('/');
        this.state={code: url[url.length-1],
                    ranklist:null,
                    problemCodeList:[],
                    contest:null,
                    page:1,
                    offset:0,
                    country:"",
                    institute:""
                }
        this.getRanklist=getRanklist.bind(this);
        this.getContestDetails=getContestDetails.bind(this);
    }
    getScore=(item)=>{
        var score=[],i,x;
        for(i=0;i<this.state.problemCodeList.length;i++){
            for(x=0;x<item.problemScore.length;x++){
                if(item.problemScore[x].problemCode==this.state.problemCodeList[i]){
                  score.push(item.problemScore[x].score);
                  break;
                }
             }
             if(x==item.problemScore.length) score.push(0);
        }
        return score.map((item1,i1)=> <td key={i1}>{item1}</td>) 
    }
    prev=()=>{
        var pag=this.state.page;
        this.setState({ranklist:null,page:pag-1,offset:(pag-1)*1500});
    }
    next=()=>{
        var pag=this.state.page;
        this.setState({ranklist:null,page:pag+1,offset:(pag)*1500});
    }
    countryChange=(e)=>{
        e.persist()
        this.setState({country: e.target.value});
    }
    instituteChange=(e)=>{
        e.persist()
        this.setState({institute: e.target.value});
    }
    logout=()=>{
        Logout();
        this.setState({});
    }
    find=()=>{
        this.setState({offset:0,page:1,ranklist:null});
    }
    render(){
        if(getCookie('refresh_token')==""){
            return <Redirect to='/my-app'/>;
        }
        refresh_token();
        if(this.state.contest==null){
            this.getContestDetails();
        }
        else if(this.state.problemCodeList.length==0){
            var pCode=this.state.contest.data.result.data.content.problemsList.map((item)=>item.problemCode)
            this.setState({problemCodeList:pCode});
        }
        else if(this.state.ranklist!=null){
            return <div className="background">
                <Link to={'/my-app/Gotocontest'}><button className="b1 b2">Home</button></Link>
                <button className="b1 topright" onClick={this.logout}>Logout</button>
                <h1 className="center">Ranklist</h1>
                <label>Countries :</label>
                <input type="text" onChange={this.countryChange} value={this.state.country}></input>&emsp;
                <label>Institute :</label>
                <input type="text" onChange={this.instituteChange} value={this.state.institute}></input>
                <button className="b1" onClick={this.find}>Find</button>
                <div className="center">
                    {(this.state.page!=1?<button onClick={this.prev} className="b1">Prev</button>:<p></p>)}
                    <label>{this.state.page}</label>
                    {(this.state.ranklist.length==1500?<button onClick={this.next} className="b1">Next</button>:<p></p>)}
                </div>
                <table className="rankList">
                    <tbody>
                        <tr>
                            <th><b>#</b></th>
                            <th><b>USERNAME</b></th>
                            <th><b>TOTAL SCORE</b></th>
                            {this.state.problemCodeList.map((item,i)=> <th key={i}>{item}</th>)}
                        </tr>
                        {this.state.ranklist.map((item,i)=>
                            <tr key={i}>
                                <td>{item.rank.toString()}</td>
                                <td>{item.username}</td>
                                <td>{item.totalScore}</td>
                                {this.getScore(item)}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        }
        else this.getRanklist();
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
function getRanklist(){
    axios.get(`https://api.codechef.com/rankings/`+this.state.code+`?offset=`+this.state.offset+`&country=`+this.state.country+`&institution=`+this.state.institute,
            {headers:{'Content-Type': 'application/json',
                       'Accept': 'application/json',
                       'Authorization': 'Bearer '+ getCookie('token')
                      }
        })
    .then(res => {
        this.setState({ranklist:res.data.result.data.content});
        console.log(res.data.result.data.content);
    })
    .catch(function (error) {
        console.log(error.message);
    });
}

export default Ranklist;

