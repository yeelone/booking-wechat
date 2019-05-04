import gql from 'graphql-tag';

export const  receiveMessage = gql`
      subscription getMsg($tunnel:String!,$adminId:Int!) {
        messageAdded(roomName:$tunnel,adminId:$adminId){
          createdBy{
            id
            username
          }
          createdAt
          id
          text
        }
      }`

export const  queryMessage = gql`
      query messages {
        messages
      }`
