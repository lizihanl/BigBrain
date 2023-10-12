const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = domPurify(new JSDOM().window);


const stripHtml = require('string-strip-html');
const req = require('express/lib/request');

mongoose.plugin(slug);
const timelineScehma = new mongoose.Schema({ 
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    }, 
    img: {
        type: String,
        default: 'default-avatar.png'
    },
    snippet:{
        type: String
    },
    slug: {type: String, slug: 'title', unique: true, slug_padding_size: 2 },

});


timelineScehma.pre('validate', function (next){
    if(this.description){
        this.description = htmlPurify.sanitize(this.description);
        this.snippet = stripHtml(this.description.substring(0,200)).result;

    }

    next();
})

const Post =  mongoose.model('bby_30_Timeline', timelineScehma)

module.exports = Post;
