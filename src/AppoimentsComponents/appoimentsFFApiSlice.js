import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../app/api/apiSlice"

const appoimentsFFAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = appoimentsFFAdapter.getInitialState()

export const appoimentsFFApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAppoimentsFF: builder.query({
            query: () => '/appoiments/fullfiled',
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
        addNewAppoimentFF: builder.mutation({
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
        updateAppoimentFF: builder.mutation({
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
        deleteAppoimentFF: builder.mutation({
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
    useGetAppoimentsFFQuery,
    useAddNewAppoimentFFMutation,
    useUpdateAppoimentFFMutation,
    useDeleteAppoimentFFMutation,
} = appoimentsFFApiSlice

// returns the query result object
export const selectAppoimentsFFResult = appoimentsFFApiSlice.endpoints.getAppoimentsFF.select()

// creates memoized selector
const selectAppoimentsFFData = createSelector(
    selectAppoimentsFFResult,
    appoimentsFFResult => appoimentsFFResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAppoiments,
    selectById: selectAppoimentById,
    selectIds: selectAppoimentIds
    // Pass in a selector that returns the notes slice of state
} = appoimentsFFAdapter.getSelectors(state => selectAppoimentsFFData(state) ?? initialState)