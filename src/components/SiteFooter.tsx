import GitHubIcon from '@mui/icons-material/GitHub';

export default function SiteFooter() {
  return (
    <div className={'p-4 flex flex-row'}>
      <div className={'ml-auto'}>
        <a href="https://github.com/bbachdev/social" target='blank'><GitHubIcon/></a>
      </div>
    </div>
  )
}
