import { Transitions } from './transition.types'

export const transition: Transitions = {
    create: (
        target: string | string[],
        duration = 600,
    ) => {
        if (Array.isArray(target)) {
            const stylesArr = target.map((element) => {
                return `${element} ${Math.round(duration)}ms ease-in-out`
            })

            return stylesArr.join(',')
        }

        return `${target} ${Math.round(duration)}ms ease-in-out`
    },
}
