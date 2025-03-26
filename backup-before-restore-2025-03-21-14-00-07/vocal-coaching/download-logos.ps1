$logos = @(
    @{
        url = "https://b-flat-berlin.de/wp-content/uploads/2019/03/b-flat-logo.png"
        file = "public/images/collaborations/bflat-logo.png"
    },
    @{
        url = "https://completevocal.institute/wp-content/uploads/2023/01/CVI-logo-white.png"
        file = "public/images/collaborations/cvi-logo.png"
    },
    @{
        url = "https://www.bluenote.co.jp/tokyo/common/img/logo_footer.png"
        file = "public/images/collaborations/bluenote-logo.png"
    },
    @{
        url = "https://www.jazz-institut-berlin.de/wp-content/themes/jib/images/logo.png"
        file = "public/images/collaborations/jib-logo.png"
    },
    @{
        url = "https://www.a-trane.de/templates/yootheme/cache/logo-white-7fef1f65.png"
        file = "public/images/collaborations/atrane-logo.png"
    },
    @{
        url = "https://www.berliner-philharmoniker.de/static/bph/img/logo-white.png"
        file = "public/images/collaborations/philharmonie-logo.png"
    }
)

foreach ($logo in $logos) {
    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        Write-Host "Downloading $($logo.url) to $($logo.file)"
        $webClient.DownloadFile($logo.url, $logo.file)
    } catch {
        Write-Host "Failed to download $($logo.url): $_"
    }
} 