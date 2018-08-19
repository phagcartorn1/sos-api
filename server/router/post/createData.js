var express = require('express')
var create = express.Router()
var  {User}  = require('../.././models/user')
var  {Language}  = require('../.././models/language')
var  {Topic}  = require('../.././models/skill')



create.post('/createData', (req, res) => {

    var users = [{userName:'pcs@ii.co.th',password:'1234',firstName:'ภัคธร',lastName:'สุวรรณศรี',type:'A',topicId:'1',languageId:'1'},
                 {userName:'pyk@ii.co.th',password:'1234',firstName:'xxx',lastName:'bbb',type:'C'}]

    User.collection.insert(users).then(()=>{
        console.log('insert user success')
    })

    var lagnguares = [{id:'1',name:'thai'},
                      {id:'2',name:'English'},
                      {id:'3',name:'Japanese'},
                      {id:'4',name:'Chinese'}];

    Language.collection.insert(lagnguares).then((d)=>{
        console.log('insert language success');

    })

    var topics = [{id:'1',name:'บริการดานประกันชีวิต'},{id:'2',name:'สอบถามผลิตภัณฑ์ควบการลงทุน'}]
    Topic.collection.insert(topics).then(()=>{
        console.log('insert topic success');
    })
    
});


module.exports = create;