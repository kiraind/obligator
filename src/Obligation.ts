export default class Obligation<A extends (...args: any[]) => any> {
  private action: A
  private timeout: ReturnType<typeof setTimeout>
  private stacktrace: string

  constructor (
    action: A,
    deadline: number,
    sanction?: () => void
  ) {
    this.stacktrace = new Error()
      .stack
      ?.split('\n')
      .slice(2)
      .join('\n') ?? ''

    if (!sanction) {
      sanction = () => {
        throw new Error(
          `Obligation to call function "${action.name}" ` +
          `was not fulfilled in ${deadline} ms${this.stacktrace ? `\n${this.stacktrace}` : ''}\n`
        )
      }
    }
    this.timeout = setTimeout(sanction, deadline)

    this.action = action
  }

  fulfill = (...args: Parameters<A>): ReturnType<A> => {
    clearTimeout(this.timeout)

    return this.action(...args)
  }
}
