import gql from 'graphql-tag';

export const  receiveMessage = gql`
      subscription getMsg {
        messageAdded(roomName:"heelo")
      }`

export const  queryMessage = gql`
      query messages {
        messages
      }`
