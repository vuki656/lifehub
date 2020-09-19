import { Transitions } from './transition.types'

export const transition: Transitions = {
    create: (
        element: string,
        duration = 600,
    ) => {
        return `${element} ${Math.round(duration)}ms`
    },
}
