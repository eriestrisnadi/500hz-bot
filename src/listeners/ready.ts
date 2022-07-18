import type { ListenerOptions, PieceContext } from '@sapphire/framework'
import { Listener, Store } from '@sapphire/framework'
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette'

const dev = process.env.NODE_ENV !== 'production'

export class UserEvent extends Listener {
  private readonly style = dev ? yellow : blue

  public constructor(context: PieceContext, options?: ListenerOptions) {
    super(context, {
      ...options,
      once: true,
    })
  }

  public run() {
    this.printBanner()
    this.printUserInfoSuccessLogin()
    this.printStoreDebugInformation()
  }

  private async printBanner() {
    const success = green('+')

    const llc = dev ? magentaBright : white
    const blc = dev ? magenta : blue

    const line01 = llc('')
    const line02 = llc('')
    const line03 = llc('')

    // Offset Pad
    const pad = ' '.repeat(7)
    /* tslint:disable */
    console.log(
      String.raw`
${line01} ${pad}${blc('0.1.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
    )
    /* tslint:enable */
  }

  private printStoreDebugInformation() {
    const { client, logger } = this.container
    const stores = [...client.stores.values()]
    const last = stores.pop()!

    for (const store of stores) logger.info(this.styleStore(store, false))
    logger.info(this.styleStore(last, true))
  }

  private printUserInfoSuccessLogin() {
    const { client, logger } = this.container
    const { id, tag } = client.user!

    logger.info(gray(`├─ Logged in as user: ${this.style(tag)} uid: ${this.style(id)}`))
  }

  private styleStore(store: Store<any>, last: boolean) {
    return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`)
  }
}
