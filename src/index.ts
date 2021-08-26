export default class Obligation<A extends (...args: any[]) => any> {
  private action: A
  private timeout: ReturnType<typeof setTimeout>

  constructor (
    action: A,
    deadline: number,
    sanction?: () => void
  ) {
    if (!sanction) {
      const createdAt = new Error()
        .stack
        ?.split('\n')[2]
        ?.match(/\(.*\)/)
        ?.[0]
        ?.slice(1, -1) ?? null

      sanction = () => {
        throw new Error(
          `Obligation to call function "${action.name}" created at ${createdAt} ` +
          `was not fulfilled in ${deadline} ms`
        )
      }
    }
    this.timeout = setTimeout(sanction, deadline)

    this.action = action
  }

  fulfill = (...args: Parameters<A>): ReturnType<A> => {
    clearTimeout(this.timeout)

    console.log(this.action)

    return this.action(...args)
  }
}
