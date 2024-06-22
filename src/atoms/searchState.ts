import {atom} from 'recoil'

export type SearchTerm = string

export const searchTermState = atom<SearchTerm>({
    key: 'searchTerm',
    default: ''
})