<template>
    <div class="admin">
        <div class="container">
            <h2>Addministration</h2>
            <div class="admin-info">
                <h2>Add Admin</h2>
                <div class="input">
                    <input placeholder="Enter user email to make them an admin" type="text" id="addAdmins" v-model="adminEmail"/>
                </div>
                <span>{{this.message}}</span>
                <button @click="addAdmin" class="button">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Admin",
    data(){
        return {
            adminEmail: "",
            message: "",
        }
    },
    methods:{
        addAdmin(){
            // get only emails
            const users = this.$store.state.allUsers;
            console.log(users);
            let arrayOfEmails = [];
            for (let i = 0; i < users.length; i++){
                let email = users[i].userEmail;
                arrayOfEmails.push(email.toLowerCase())
            }

            // check if email submited exists in database
            let adminEmail = this.adminEmail.toLowerCase();
            if(arrayOfEmails.includes(adminEmail)){
                this.message = `Success! ${adminEmail} is now an admin!`;
                return;
            }
            else if (adminEmail === ""){
                this.message = 'Please enter an Email!';
                return;
            }  else {
                this.message = `${adminEmail} does not exist! Make sure is written properly or the user has been registered!`;
                return;
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.admin{
    padding: 50px 10px;
    .container{
        max-width: 1000px;
        padding: 60px 25px;

        h2{
            text-align: center;
            margin-bottom: 20px;
            font-weight: 300;
            font-size: 32px;
        }

        .admin-info{
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 32px;
            background-color: white;
            display: flex;
            flex-direction: column;
            max-width: 600px;
            margin: 32px auto;

            span{
                font-size: 14px;
            }

            .input{
                margin: 16px 0;

                label{
                    font-size: 14px;
                    display: block;
                    padding-bottom: 6px;
                }

                input{
                    width: 100%;
                    border: none;
                    background-color: #f2f7f6;
                    padding: 8px;
                    height: 50px;
                    @media(min-width: 900px){

                    }

                    &:focus{
                        outline: none;
                    }
                }
            }
            button{
                text-align: center;
            }
        }
    }
}
</style>