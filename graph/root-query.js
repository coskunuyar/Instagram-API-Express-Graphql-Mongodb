const graphql = require('graphql');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const {UserType , PostType , CommentType} = require('./schema');

const {
    GraphQLObjectType , 
    GraphQLID , 
    GraphQLList
} = graphql;


module.exports = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: { type: GraphQLID }},
            resolve(parent , args){
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent , args){
                return User.find();
            }
        },
        post: {
            type: PostType,
            args: {id: { type: GraphQLID}},
            resolve(parent,args){
                return Post.findById(args.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent,args){
                return Post.find();
            }
        },
        comment: {
            type: CommentType,
            args: {id: { type: GraphQLID}},
            resolve(parent,args){
                return Comment.findById(args.id);
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            args: {postId: { type: GraphQLID}},
            resolve(parent,args){
                return Comment.find();
            }
        }
    }
});