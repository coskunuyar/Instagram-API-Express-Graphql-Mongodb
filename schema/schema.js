const graphql = require('graphql');

const {
    GraphQLObjectType , 
    GraphQLSchema , 
    GraphQLID , 
    GraphQLList , 
    GraphQLString , 
    GraphQLInt
} = graphql;

const userList = [
    {id: "1" , username: "coskun" , friends: ["2","3"] },
    {id: "2" , username: "neo" , friends: ["1","3"] },
    {id: "3" , username: "morpheus" , friends: ["1","2"] }
];

const postList = [
    {id: "1" , ownerId: "1" , likedByUsers: ["3"] , img: "https://source.unsplash.com/random" },
    {id: "2" , ownerId: "1" , likedByUsers: ["1","2","3"] , img: "https://source.unsplash.com/random"},
    {id: "3" , ownerId: "1" , likedByUsers: ["2","3"] , img: "https://source.unsplash.com/random"},
    {id: "4" , ownerId: "2" , likedByUsers: ["2"] , img: "https://source.unsplash.com/random"},
    {id: "5" , ownerId: "2" , likedByUsers: ["1","2","3"] , img: "https://source.unsplash.com/random"},
    {id: "6" , ownerId: "2" , likedByUsers: ["1","3"] , img: "https://source.unsplash.com/random"},
    {id: "7" , ownerId: "3" , likedByUsers: [] , img: "https://source.unsplash.com/random"},
    {id: "8" , ownerId: "3" , likedByUsers: ["1","2"] , img: "https://source.unsplash.com/random"},
    {id: "9" , ownerId: "3" , likedByUsers: ["2","3"] , img: "https://source.unsplash.com/random"}
];

const commentList = [
    {id:"1" , ownerId: "1" , postId: "1" , text: "Perfect Pic!"},
    {id:"2" , ownerId: "2" , postId: "5" , text: "Perfect Pic!"},
    {id:"3" , ownerId: "3" , postId: "6" , text: "Perfect Pic!"},
    {id:"4" , ownerId: "1" , postId: "7" , text: "Perfect Pic!"},
    {id:"5" , ownerId: "3" , postId: "7" , text: "Perfect Pic!"},
    {id:"6" , ownerId: "2" , postId: "7" , text: "Perfect Pic!"},
    {id:"7" , ownerId: "3" , postId: "5" , text: "Perfect Pic!"},
    {id:"8" , ownerId: "1" , postId: "3" , text: "Perfect Pic!"},
    {id:"9" , ownerId: "1" , postId: "3" , text: "Perfect Pic!"},
];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent , args){
                return postList.filter( post =>  post.ownerId === parent.id );
            }
        },
        friends: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return userList.filter( user => parent.friends.includes(user.id));
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
                return userList.filter( user =>  parent.likedByUsers.includes(user.id));
            }
        },
        numberOfLikes: {
            type: GraphQLInt,
            resolve(parent,args){
                return userList.filter( user =>  parent.likedByUsers.includes(user.id)).length;
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent,args){
                return commentList.filter(comment => comment.postId === parent.id);
            }
        },
        numberOfComments: {
            type: GraphQLInt,
            resolve(parent,args){
                return commentList.filter(comment => comment.postId === parent.id).length;
            }
        },
        owner: {
            type: UserType,
            resolve(parent,args){
                return userList.filter( user => user.id === parent.ownerId );
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
                return userList.filter( user => user.id === parent.ownerId )[0];
            }
        },
        post: {
            type: PostType,
            resolve(parent , args){
                return postList.filter( post =>  post.id === parent.postId )[0];
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {id: { type: GraphQLID }},
            resolve(parent , args){
                return userList.filter( user => user.id === args.id)[0];
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent , args){
                return userList;
            }
        },
        post: {
            type: PostType,
            args: {id: { type: GraphQLID}},
            resolve(parent,args){
                return postList.filter(post => post.id === args.id)[0];
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent,args){
                return postList;
            }
        },
        comment: {
            type: CommentType,
            args: {id: { type: GraphQLID}},
            resolve(parent,args){
                return commentList.filter(post => post.id === args.id)[0];
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            args: {postId: { type: GraphQLID}},
            resolve(parent,args){
                return commentList.filter( comment => comment.postId === args.postId);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});