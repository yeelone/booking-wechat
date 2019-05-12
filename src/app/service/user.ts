import gql from 'graphql-tag';

export const  queryTickets = gql`
  query queryTickets($userId:Int!){
      tickets(filter:{userId:$userId,count:true}){
        totalCount
        count{
          breakfast
          lunch
          dinner
        }
      }
      }`

export const queryCanteensByAdmin = gql`
  query canteen($adminId:Int!) {
    canteens(filter:{adminID:$adminId}) {
      rows{
        id
        qrcode
        qrcodeUuid
        name

        admin{
          id
          username
        }
      }
    }
  }
`

export const  updateUser = gql`
    mutation updateUser($id:Int!,$username:String,$password:String, $email:String,$picture:String){
      updateUser(input:{id:$id,username:$username,email:$email,picture:$picture,password:$password}){
        id
        username
        picture
        email
        state 
      }
}`

export const loginUser = gql`
  mutation login($username:String!, $password: String!) {
    login(input:{username:$username,password:$password}){
      token
      permissions
      user{
        id
        username
        qrcode
        groups{
          totalCount
          rows{
            id
            name
          }
        }

        roles{
          rows{
            id
            name
          }
        }

        tickets(filter:{count:true}){
          totalCount
          count{
            breakfast
            lunch
            dinner
          }
        }
      }
    }
  }
`

export const logoutUser = gql`
  mutation logout($username:String!) {
    logout(input:{username:$username})
  }
`

export const queryCanteensOfGroup =  gql`
  query getGroups($gid:Int!) {
  groups(filter:{id:$gid}){
    rows{
      id
      name
      
      canteens{
        totalCount
        rows{
          id
          name
          breakfastTime
          lunchTime
          dinnerTime
        }
      }
    }
  }
}
`

export const bookingBreakfast=gql`
  mutation booking($userId:Int!,$canteenId:Int!,$date:String!) {
    booking(input:{userId:$userId, canteenId:$canteenId,type:breakfast,date:$date})
  }
`
export const bookingLunch=gql`
  mutation booking($userId:Int!,$canteenId:Int!,$date:String!) {
    booking(input:{userId:$userId, canteenId:$canteenId,type:lunch,date:$date})
  }
`

export const bookingDinner=gql`
  mutation booking($userId:Int!,$canteenId:Int!,$date:String!) {
    booking(input:{userId:$userId, canteenId:$canteenId,type:dinner,date:$date})
  }
`

export const queryBooking=gql`
  query queryBooking($userId:Int!){
    booking(filter:{userId:$userId}){
      skip
      totalCount
      rows{
        id
        userId
        createdAt
        date
        type
        canteenId
      }
    }
  }
`

export const cancelBooking = gql`
  mutation cancelBooking($userId:Int!,$bookingId:Int!){
    cancelBooking(input:{userId:$userId, bookingId:$bookingId})
  }
`

export const spend = gql`
  mutation spend($userId:Int!, $canteenId:Int!, $uuid:String!){
    spend(input:{userId:$userId, canteenId:$canteenId, uuid:$uuid})
  }
`

export const transfer = gql`
  mutation transfer($fromUserId:Int!, $toUserId:Int!,$number:Int!, $type:String!){
    transferTickets(input:{fromUserId:$fromUserId, toUserId:$toUserId, number:$number,type:$type}){
      errorMsg
      errorCount
      successCount
    }
  }
`


export const queryConfig = gql`
  query config {
      config{
        wxAppID
        prompt
      }
    }
`