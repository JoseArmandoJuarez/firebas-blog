import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app';
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sampleBlogCards:[
        {blogTitle: "Blog Card  #1", blogCoverPhoto: "stock-1", blogDate: "May 1, 2022"},
        {blogTitle: "Blog Card  #2", blogCoverPhoto: "stock-2", blogDate: "May 2, 2022"},
        {blogTitle: "Blog Card  #3", blogCoverPhoto: "stock-3", blogDate: "May 3, 2022"},
        {blogTitle: "Blog Card  #4", blogCoverPhoto: "stock-4", blogDate: "May 4, 2022"},
      ],
      blogPosts: [],
      postLoaded: null,

      blogHTML: "Write your blog title here...",
      blogTitle: "",
      blogPhotoName: "",
      blogPhotoFileURL: "",
      blogPhotoPreview: "",

      allUsers: [],
      userLoaded: null,

      editPost: null,
      user: null,
      isAdmin: null,
      profileEmail: null,
      profileFirstName: null,
      profileLastName: null,
      profileUsername: null,
      profileId: null,
      profileInitials: null
  },
  getters: {
    blogPostsFeed(state){
      return state.blogPosts.slice(0, 2);
    },
    blogPostsCards(state){
      return state.blogPosts.slice(2, 6);
    }
  },
  mutations: {
    newBlogPost(state, payload){
      state.blogHTML = payload;
    },
    updateBlogTitle(state, payload){
      state.blogTitle = payload;
    },
    fileNameChange(state, payload){
      state.blogPhotoName = payload;
    },
    createFileURL(state, payload){
      state.blogPhotoFileURL = payload;
    },
    openPhotoPreview(state){
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    toggleEditPost(state, payload){
      state.editPost = payload;
      // console.log(state.editPost); // consoles true or false when toggle the edit mode
    },
    setBlogState(state, payload){
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },
    filterBlogPost(state, payload){
      state.blogPosts = state.blogPosts.filter(post => post.blogID !== payload)
    },
    updateUser(state, payload){
      state.user = payload;
    },
    setProfileAdmin(state, payload){
      state.isAdmin = payload;
    },
    setProfileInfo(state, doc){
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUsername = doc.data().username;
    },
    setProfileInitials(state){
      // getting the initials of the name
      state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join("") + state.profileLastName.match(/(\b\S)?/g).join("");
    },
    changeFirstName(state, payload){
      state.profileFirstName = payload;
    },
    changeLastName(state, payload){
      state.profileLastName = payload;
    },
    changeUsername(state, payload){
      state.profileUsername = payload;
    },
  },
  actions: {
    async getCurrentUser({commit}){
      const dataBase = await db.collection('users').doc(firebase.auth().currentUser.uid);
      const dbResults = await dataBase.get();

      commit("setProfileInfo", dbResults);
      commit("setProfileInitials");

      const admin = dbResults.data().admin;
      commit("setProfileAdmin", admin);
    },

    async getAllUsers({state}){
      const dataBase = await db.collection('users');
      const dbResults = await dataBase.get();

      // console.log(dbResults.docs);

      dbResults.forEach((doc) => {
        //console.log(doc);
        if(!state.allUsers.some((user) => user.userId === doc.id)){
          const data = {
            userID: doc.data().userId,
            userAdmin: doc.data().admin,
            userEmail: doc.data().email,
            userFirstName: doc.data().firstName,
            userLastName: doc.data().lastName,
            userUserame: doc.data().username,
          };

          state.allUsers.push(data);
        }
      });
      state.userLoaded = true;
      // console.log(state.allUsers);
    },

    async getPost({ state }){
      const dataBase = await db.collection('blogPosts').orderBy('date', 'desc');
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if(!state.blogPosts.some((post) => post.blogID === doc.id)){
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName
          };

          state.blogPosts.push(data);
        }
      });
      state.postLoaded = true;
      // console.log(state.blogPosts);
    },

    async updatePost({commit, dispatch}, payload){
      commit("filterBlogPost", payload);
      await dispatch('getPost');
    },

    async deletePost({commit}, payload){
      const getPost = await db.collection("blogPosts").doc(payload);
      await getPost.delete();
      commit("filterBlogPost", payload);
    },

    async updateUserSettings({commit, state}){
      const dataBase = await db.collection('users').doc(state.profileId);
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername
      });
      commit("setProfileInitials");
    },

  },
  modules: {}
})
