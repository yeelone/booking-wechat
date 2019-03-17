import gql from 'graphql-tag';

export const  queryTest = gql`
    query getViewer{
        viewer {
            login
        }
}`