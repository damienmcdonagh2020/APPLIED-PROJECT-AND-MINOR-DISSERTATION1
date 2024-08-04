import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Move the interface definition outside the class
interface GraphQLRequest {
    query: string;
    variables?: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  // The endpoint of your GraphQL server.
  private apiUrl = 'http://localhost:4000/graphql';

  constructor(private http: HttpClient) { }

  /**
   * A generic method to fetch data using GraphQL.
   * 
   * @param {GraphQLRequest} request - The GraphQL request object.
   * @returns {Observable<any>} - An observable of the HTTP response.
   */
  fetchData(request: GraphQLRequest): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }
}

