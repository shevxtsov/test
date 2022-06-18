export default function () {
  return [
    {
      id: 4,
      link: '/missions',
      name: this.$t('Missions'),
      toolbar: true,
      min: 'min-1230'
    },
    {
      id: 5,
      link: '/processing',
      name: this.$t('Processing'),
      toolbar: true,
      min: 'min-1230'
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
