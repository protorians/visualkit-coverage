import "./index.scss"
import {IParameters} from "@protorians/widgets";
import {ProgressKit} from "@visualkit/progress";
import {defineKit, useKit, type KitSchematic, type KitWidget, AssetsKit} from "@visualkit/core";
import {ProgressType} from "@visualkit/progress/constants";
import type {ICoverage} from "./types";
import type {IProgressAbility} from "@visualkit/progress/types";

const Identifier: string = "coverage";
const Schematic: KitSchematic<ICoverage<IParameters>> = {
  tag: 'div',
  identifier: Identifier,
  main: ({fallback, error, assets, timeout, children}): KitWidget => {

    return {
      children: fallback,
      signal: {
        mount: ({payload: {widget: kit}}) => {
          if (assets) {

            let progress: IProgressAbility | undefined;
            const main = new AssetsKit<IParameters>(assets)
            const progressKit = ProgressKit({
              type: ProgressType.Bar,
              value: 1,
              label: 'Loading...',
              min: 0,
              max: main.entries.length,
              ability: (ref) => progress = ref,
            })

            main.signals
              // .listen('load:style', ({payload: {entry}}) =>
              //   console.log('Chargement du style : ', (entry.href))
              // )
              // .listen('load:script', ({payload: {entry}}) =>
              //   console.log('Chargement du script : ', (entry.src))
              // )
              // .listen('load:service', ({payload: {entry}}) =>
              //   console.log('Validation des données : ', (entry.endpoint))
              // )
              .listen('load', () => {
                if (progress)
                  progress.set('value', (progress.property.state.value || 0) + 1)
              })
              .listen('error', ({payload}) => {
                if (assets.strict && error) {
                  kit.clear().children(error(payload))
                }
              })
              .listen('complete', () => {
                const fn = () => {
                  const widget = children(main.props)
                  if (!widget.isReady) widget.render()
                  kit.replaceWith(widget)
                }

                if (timeout) {
                  setTimeout(() => fn(), timeout)
                } else fn();
              })

            kit.children(progressKit)

            main.run()

          }

        }
      },
    }

  },

}

function CoverageKit<P>(props: ICoverage<P>) {
  return useKit<ICoverage<P>>(Identifier, props);
}

// function defaultCoverageAppearance(
//   label: string,
//   about?: string,
//   version?: string,
// ){
//   return Widget({
//     children: [
//
//         Widget({
//           className: `${identifier}:label`,
//           children: Text(label),
//         }),
//
//         version ? Widget({
//           className: `${identifier}:version`,
//           children: Text(version),
//         }) : undefined,
//
//         about ? Widget({
//           className: `${identifier}:about`,
//           children: Text(about),
//         }) : undefined,
//     ]
//   })
// }

defineKit<ICoverage<IParameters>>(Schematic)

export {
  Identifier,
  Schematic,
  CoverageKit,
}
