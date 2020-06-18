const { GraphQLObjectType , GraphQLID , GraphQLList ,GraphQLString , GraphQLInt } = require('graphql');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent , args){
                return Post.find({ownerId: parent.id});
            }
        },
        friends: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find().where('_id').in(parent.friends);
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        img: { type: GraphQLString },
        likes: {
            type: new GraphQLList(UserType),
            resolve(parent,args){
                return User.find().where('_id').in(parent.likedByUsers);
            }
        },
        numberOfLikes: {
            type: GraphQLInt,
            resolve(parent,args){
                return parent.likedByUsers.length;
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent,args){
                return Comment.find({postId: parent.id});
            }
        },
        numberOfComments: {
            type: GraphQLInt,
            async resolve(parent,args){
                let result = await Comment.find({postId: parent.id});
                return result.length;
            }
        },
        owner: {
            type: UserType,
            resolve(parent,args){
                return User.findById(parent.ownerId);
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString },
        owner: {
            type: UserType,
            resolve(parent,args){
                return User.findById(parent.ownerId);
            }
        },
        post: {
            type: PostType,
            resolve(parent , args){
                return Post.findById(parent.postId);
            }
        }
    })
});

module.exports = {
    UserType,
    PostType,
    CommentType
}