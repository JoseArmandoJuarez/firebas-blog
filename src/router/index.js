import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Blogs from '../views/Blogs.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Profile from '../views/Profile.vue';
import Admin from '../views/Admin.vue';
import CreatePost from '../views/CreatePost.vue';
import BlogPreview from '../views/BlogPreview.vue';
import ViewBlog from '../views/ViewBlog.vue';
import EditBlog from '../views/EditBlog.vue';
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      requiresAuth: false
    }
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs,
    meta: {
      title: 'Blogs',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register',
      requiresAuth: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {
      title: 'Forgot Password',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile',
      requiresAuth: false
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost,
    meta: {
      title: 'Create Post',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/post-preview',
    name: 'BlogPreview',
    component: BlogPreview,
    meta: {
      title: 'Preview Blog Post',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/view-blog/:blogid',
    name: 'ViewBlog',
    component: ViewBlog,
    meta: {
      title: 'View Blog Post',
      requiresAuth: false
    }
  },
  {
    path: '/edit-blog/:blogid',
    name: 'EditBlog',
    component: EditBlog,
    meta: {
      title: 'Edit Blog Post',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
]

const router = new VueRouter({
  routes
})

// implement titles on the page tab
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | JrzBlog`;
  next();
});

router.beforeEach(async(to, from, next) => {
  let user = firebase.auth().currentUser;
  let admin = null;
  // console.log(admin);

  if(user){
    const dataBase = await db.collection('users').doc(firebase.auth().currentUser.uid);
    const dbResults = await dataBase.get();
    admin = dbResults.data().admin;
  }

  if(to.matched.some((res) => res.meta.requiresAuth)){
    if(user){
      if(to.matched.some((res) => res.meta.requiresAdmin)){
        if(admin){
          return next();
        }
        return next({name: 'Home'});
      }
      return next();
    }
    return next({name: 'Home'});
  }
  return next();
});

export default router
