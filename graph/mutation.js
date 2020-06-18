const graphql = require('graphql');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const {UserType , PostType , CommentType} = require('./schema');

const {
    GraphQLObjectType , 
    GraphQLSchema , 
    GraphQLID , 
    GraphQLList , 
    GraphQLString , 
    GraphQLInt
} = graphql;


module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: GraphQLString }
            },
            resolve(parent,args){
                let user = new User({ username: args.username , friends: []});
                return user.save();
            }
        },
        addFriend: {
            type: UserType,
            args: {
                userId: { type: GraphQLID },
                friendId: { type: GraphQLID } 
            },
            async resolve(parent,args){
                let user = await User.findById(args.userId);
                user.friends.push(args.friendId);
                return user.save();
            }
        },
        addPost: {
            type: PostType,
            args: {
                ownerId: { type: GraphQLID },
                img: { type: GraphQLString }
            },
            resolve(parent,args){
                let post = new Post({ ownerId: args.ownerId , img: args.img });
                return post.save();
            }
        },
        likePost: {
            type: PostType,
            args: {
                postId: { type: GraphQLID },
                userId: { type: GraphQLID }
            },
            async resolve(parent, args){
                let post = await Post.findById(args.postId);
                post.likedByUsers.push(args.userId);
                return post.save();
            }
        },
        commentPost: {
            type: CommentType,
            args: {
                ownerId: { type: GraphQLID },
                postId: { type: GraphQLID },
                text: { type: GraphQLString }
            },
            resolve(parent,args){
                let comment = new Comment(args);
                return comment.save();
            }
        }
    }
});
