import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { ApolloLink , split} from 'apollo-link';
import { onError } from 'apollo-link-error';
import {WebSocketLink} from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

// const uri = "http://localhost:8080/query";
// const wsUri = "ws://localhost:8080/query";

const uri = "http://jd96138.com/query";
const wsUri = "ws://jd96138.com/query";


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


export function createApollo(httpLink: HttpLink) {
  const wsClient = new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true,
    },
  });

  // const httpLinkWithErrorHandling = ApolloLink.from([
  //   errorLink,
  //   wsClient,
  //   httpLink.create({uri}),
  // ]);

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsClient,
    httpLink.create({uri}),
  );

  return {
    link: link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
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