export default function () {
  return [
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
      id: 9,
      link: '/audits',
      name: this.$t('Audits'),
      toolbar: true,
      min: 'min-1700'
    },
    {
      id: 10,
      link: '/password-change',
      name: this.$t('PasswordChange'),
      toolbar: false,
      min: 'min-1700'
    }
  ]
}
