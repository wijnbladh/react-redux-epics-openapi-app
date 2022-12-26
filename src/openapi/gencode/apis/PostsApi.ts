/* tslint:disable */
/* eslint-disable */
/**
 * Json Placeholder Typicode
 * This is a partial Swagger/OpenApi modelling of the mock API available at [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/). 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    Comment,
    CommentFromJSON,
    CommentToJSON,
    Post,
    PostFromJSON,
    PostToJSON,
} from '../models';

/**
 * 
 */
export class PostsApi extends runtime.BaseAPI {

    /**
     * Get all Comments, it has to be the most awesomest since there are many
     */
    async getAllCommentsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<Array<Comment>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/comments`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CommentFromJSON));
    }

    /**
     * Get all Comments, it has to be the most awesomest since there are many
     */
    async getAllComments(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<Array<Comment>> {
        const response = await this.getAllCommentsRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get all Posts, it is even more awesome than getting all Users
     */
    async getAllPostsRaw(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<runtime.ApiResponse<Array<Post>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/posts`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PostFromJSON));
    }

    /**
     * Get all Posts, it is even more awesome than getting all Users
     */
    async getAllPosts(initOverrides?: RequestInit | runtime.InitOverideFunction): Promise<Array<Post>> {
        const response = await this.getAllPostsRaw(initOverrides);
        return await response.value();
    }

}