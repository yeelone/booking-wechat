import gql from 'graphql-tag';

export const  queryUsers = gql`
      query getUsers($skip:Int!,$take:Int!,$username:String,$email:String){
        users(pagination:{skip:$skip,take:$take},filter:{username:$username,email:$email}){
          totalCount
          rows{
            id
            username
            email
            picture
            password
          }
        }
      }`

export const  queryUserWithGroup = gql`
      query getUsers($skip:Int!,$take:Int!){
        users(pagination:{skip:$skip,take:$take}){
          totalCount
          rows{
            id
            username
            email
            picture
            password
            groups{
              totalCount
              skip
              take
              rows{
                id
                name
              }
            }
          }
        }
      }`

export const  queryUserWithRole = gql`
      query getUsers($skip:Int!,$take:Int!){
        users(pagination:{skip:$skip,take:$take}){
          totalCount
          rows{
            id
            username
            email
            picture
            password
            roles{
              totalCount
              skip
              take
              rows{
                id
                name
              }
            }
          }
        }
      }`


export const  updateUser = gql`
    mutation updateUser($id:Int!,$username:String,$email:String,$picture:String){
      updateUser(input:{id:$id,username:$username,email:$email,picture:$picture}){
        id
        username
        picture
        email
        state 
      }
}`

export const  createUser = gql`
    mutation createUser($username: String!,$email: String!$picture:String){
      createUser(input:{username:$username,email:$email,password:"123456",picture:$picture}){
        id
        username
        picture
        email
        state 
      }
}`

export const deleteUsers = gql`
  mutation deleteUser($ids:[Int!]!) {
    deleteUser(input:{ids:$ids})
  }
`