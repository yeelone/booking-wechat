// import {NgModule} from '@angular/core';
// import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
// import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
// import {InMemoryCache} from 'apollo-cache-inmemory';
// import { ApolloLink , split} from 'apollo-link';
// import { onError } from 'apollo-link-error';
// import {WebSocketLink} from 'apollo-link-ws';
// import { getMainDefinition } from 'apollo-utilities';
// import config from './config/config';

// const uri = "http://"+config.server+"/query";
// const wsUri = "ws://"+config.server+"/query";

// const errorLink = onError(({ graphQLErrors, networkError }) => {
  
//   if (graphQLErrors){
//     graphQLErrors.map(({ message, locations, path }) => {
//       console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
//     });
//   }
//   if (networkError) {
//     let errors = networkError['error']['errors'];
//     networkError.message = "errorMsg:\"" + errors[0]["message"] +  "\";errorDetail:"  + "\"" + errors[0]['path'][0] + ":" + errors[0]['path'][1] + "\""  ;
//   }
// });


// export function createApollo(httpLink: HttpLink) {
//   // const wsClient = new WebSocketLink({
//   //   uri: wsUri,
//   //   options: {
//   //     reconnect: true,
//   //   },
//   // });

//   // const httpLinkWithErrorHandling = ApolloLink.from([
//   //   errorLink,
//   //   wsClient,
//   //   httpLink.create({uri}),
//   // ]);

//   const link = split(
//     // split based on operation type
//     ({ query }) => {
//       const { kind, operation } = getMainDefinition(query);
//       return kind === 'OperationDefinition' && operation === 'subscription';
//     },
//     // wsClient,
//     httpLink.create({uri}),
//   );

//   return {
//     link: link,
//     cache: new InMemoryCache(),
//     connectToDevTools: true,
//   };
// }

// @NgModule({
//   exports: [ApolloModule, HttpLinkModule],
//   providers: [
//     {
//       provide: APOLLO_OPTIONS,
//       useFactory: createApollo,
//       deps: [HttpLink],
//     },
//   ],
// })
// export class GraphQLModule {}


import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {WebSocketLink} from 'apollo-link-ws';
import { ApolloLink , split} from 'apollo-link';
import { setContext } from 'apollo-link-context';
import config from './config/config';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';

const uri =  "http://"+config.server+"/query"; // <-- add the URL of the GraphQL server here
const wsUri = "ws://"+config.server+"/query";


export function createApollo(httpLink: HttpLink) {
  

  const errorLink = onError(({ graphQLErrors, networkError }) => {
  
    if (graphQLErrors){
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }
    if (networkError) {
      let errors = networkError['error']['errors'];
      networkError.message = "errorMsg:\"" + errors[0]["message"] +  "\";errorDetail:"  + "\"" + errors[0]['path'][0] + ":" + errors[0]['path'][1] + "\""  ;
    }
  });
  
  const auth = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('currentToken');
    // return the headers to the context so httpLink can read them
    // in this example we assume headers property exists
    // and it is an instance of HttpHeaders
    if (!token) {
      return {};
    } else {
      return {
        headers: {Authorization: `Bearer ${token}`}
      };
    }
  });
  
  const wsClient = new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true,
    },
  });

  const httpLinkWithErrorHandling = ApolloLink.from([
    errorLink,
    wsClient,
    httpLink.create({uri}),
  ]);

  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsClient,
    httpLink.create({uri}),
  );

  return {
    link: auth.concat(link),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
