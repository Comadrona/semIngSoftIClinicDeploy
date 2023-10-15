import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../app/api/apiSlice"

const appoimentsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = appoimentsAdapter.getInitialState()

export const appoimentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAppoiments: builder.query({
            query: () => '/appoiments',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Appoiment', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Appoiment', id }))
                    ]
                } else return [{ type: 'Appoiment', id: 'LIST' }]
            }
        }),
        addNewAppoiment: builder.mutation({
            query: initialAppoiment => ({
                url: '/appoiments',
                method: 'POST',
                body: {
                    ...initialAppoiment,
                }
            }),
            invalidatesTags: [
                { type: 'Appoiment', id: "LIST" }
            ]
        }),
        updateAppoiment: builder.mutation({
            query: initialAppoiment => ({
                url: '/appoiments',
                method: 'PATCH',
                body: {
                    ...initialAppoiment,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Appoiment', id: arg.id }
            ]
        }),
        deleteAppoiment: builder.mutation({
            query: ({ id }) => ({
                url: '/appoiments',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Appoiment', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetAppoimentsQuery,
    useAddNewAppoimentMutation,
    useUpdateAppoimentMutation,
    useDeleteAppoimentMutation,
} = appoimentsApiSlice

// returns the query result object
export const selectAppoimentsResult = appoimentsApiSlice.endpoints.getAppoiments.select()

// creates memoized selector
const selectAppoimentsData = createSelector(
    selectAppoimentsResult,
    appoimentsResult => appoimentsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAppoiments,
    selectById: selectAppoimentById,
    selectIds: selectAppoimentIds
    // Pass in a selector that returns the notes slice of state
} = appoimentsAdapter.getSelectors(state => selectAppoimentsData(state) ?? initialState)