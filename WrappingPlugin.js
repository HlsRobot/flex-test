import { FlexPlugin } from 'flex-plugin';
import { Actions } from '@twilio/flex-ui'
//import DemoComponent from './components/DemoComponent'
import React from 'react'

const PLUGIN_NAME = 'SkipWrapupPlugin';

export default class SkipWrapupPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    flex.AgentDesktopView.defaultProps.showPanel2 = false;

    // flex.CRMContainer.Content.replace(<DemoComponent key="demo-component" />)

    const timeoutInSeconds = 5;

    Actions.replaceAction('AcceptTask', (payload, original) => {
      const reservation = payload.task.sourceObject;
      const task = payload.task;

      console.log(`${PLUGIN_NAME}: register timeout for task ${task.sid} with ${timeoutInSeconds} seconds`);

      reservation.addListener('wrapup', () => {

        setTimeout(() => {
          console.log(`${PLUGIN_NAME}: complete task ${task.sid} after timeout`);
          task.complete()
        }, (timeoutInSeconds * 1000))

      })
      return original(payload);
    })

  }
}
