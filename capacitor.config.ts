import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.todo.app',
  appName: 'TodoList',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
}

export default config


