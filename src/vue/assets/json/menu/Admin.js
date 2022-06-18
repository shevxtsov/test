export default function () {
  return [
    {
      id: 1,
      link: '/organizations',
      name: this.$t('Organizations'),
      toolbar: true,
      min: 'min-1030'
    },
    {
      id: 2,
      link: '/users',
      name: this.$t('Users'),
      toolbar: true,
      min: 'min-1030'
    },
    {
      id: 3,
      link: '/folders',
      name: this.$t('Folders'),
      toolbar: true,
      min: 'min-1030'
    },
    {
      id: 4,
      link: '/missions',
      name: this.$t('Missions'),
      toolbar: true,
      min: 'min-1230'
    },
    {
      id: 5,
      link: '/sanctions',
      name: this.$t('Sanctions'),
      toolbar: true,
      min: 'min-1230'
    },
    {
      id: 6,
      link: '#',
      name: this.$t('Equipment'),
      toolbar: true,
      min: 'min-1400',
      subList: [
        {
          link: '/checking-state',
          name: this.$t('CheckingState')
        }
      ]
    },
    {
      id: 7,
      link: '/traffic-controll',
      name: this.$t('TrafficControll'),
      toolbar: true,
      min: 'min-1600'
    },
    {
      id: 8,
      link: '/white-lists',
      name: this.$t('WhiteLists'),
      toolbar: true,
      min: 'min-1700'
    },
    {
      id: 9,
      link: '/communication-objects',
      name: this.$t('CommunicationObjects'),
      toolbar: true,
      min: 'min-1900'
    },
    {
      id: 10,
      link: '/audits',
      name: this.$t('Audits'),
      toolbar: true,
      min: 'min-1900'
    },
    {
      id: 11,
      link: '/password-change',
      name: this.$t('PasswordChange'),
      toolbar: false,
      min: 'min-1900'
    }
  ]
}
