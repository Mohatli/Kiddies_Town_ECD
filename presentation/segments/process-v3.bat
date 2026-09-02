@echo off
setlocal enabledelayedexpansion

set FF=C:\Users\mohat\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0-full_build\bin\ffmpeg.exe
set SEGS=C:\Users\mohat\OneDrive\Documents\New folder\presentation\segments
set FON=C\\:/Windows/Fonts/arial.ttf
set FONB=C\\:/Windows/Fonts/arialbd.ttf

echo ============================================
echo  Reprocessing segments with top-bar text
echo ============================================

REM --- 01 Landing ---
echo [1/8] 01-landing...
"%FF%" -y -i "%SEGS%\01-landing.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Kiddies Town ECD ^& Academy Portal':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.5\,4.5)',drawtext=fontfile='%FON%':text='Explore our premium early childhood development platform':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.5\,4.5)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\01-landing-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 01) else (echo [OK] 01-landing-v3.mp4)

REM --- 02 Login ---
echo [2/8] 02-login...
"%FF%" -y -i "%SEGS%\02-login.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Secure Login':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.3\,3.5)',drawtext=fontfile='%FON%':text='Sign in as Parent\, Teacher or Admin':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.3\,3.5)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\02-login-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 02) else (echo [OK] 02-login-v3.mp4)

REM --- 03 Parent Hub ---
echo [3/8] 03-parent-hub...
"%FF%" -y -i "%SEGS%\03-parent-hub.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Parent Dashboard':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.5\,5)',drawtext=fontfile='%FON%':text='Track your child^\''s learning progress\, attendance ^& fees':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.5\,5)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\03-parent-hub-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 03) else (echo [OK] 03-parent-hub-v3.mp4)

REM --- 04 Teacher Console ---
echo [4/8] 04-teacher-console...
"%FF%" -y -i "%SEGS%\04-teacher-console.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Teacher Console':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.5\,5)',drawtext=fontfile='%FON%':text='Manage learners\, attendance ^& progress reports':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.5\,5)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\04-teacher-console-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 04) else (echo [OK] 04-teacher-console-v3.mp4)

REM --- 05 Admin Center ---
echo [5/8] 05-admin-center...
"%FF%" -y -i "%SEGS%\05-admin-center.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Admin Control Center':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.5\,5)',drawtext=fontfile='%FON%':text='Full system management ^& user oversight':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.5\,5)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\05-admin-center-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 05) else (echo [OK] 05-admin-center-v3.mp4)

REM --- 06 Enrolment Wizard ---
echo [6/8] 06-enrolment-wizard...
"%FF%" -y -i "%SEGS%\06-enrolment-wizard.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Enrolment Wizard':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.3\,4)',drawtext=fontfile='%FON%':text='Complete the 3-step enrolment process':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.3\,4)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\06-enrolment-wizard-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 06) else (echo [OK] 06-enrolment-wizard-v3.mp4)

REM --- 07 PDF Guide ---
echo [7/8] 07-pdf-guide...
"%FF%" -y -i "%SEGS%\07-pdf-guide.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='PDF Curriculum Guide':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.3\,4)',drawtext=fontfile='%FON%':text='Generate developmental milestone reports':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=78:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.3\,4)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\07-pdf-guide-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 07) else (echo [OK] 07-pdf-guide-v3.mp4)

REM --- 08 Outro ---
echo [8/8] 08-outro...
"%FF%" -y -i "%SEGS%\08-outro.mp4" -filter_complex "drawtext=fontfile='%FONB%':text='Kiddies Town ECD ^& Academy':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=30:box=1:boxcolor=0x6366f1@0.85:boxborderw=14:enable='between(t\,0.3\,3)',drawtext=fontfile='%FON%':text='Built with React 19\, Express ^& NeonDB':fontcolor=white@0.92:fontsize=28:x=(w-text_w)/2:y=84:box=1:boxcolor=0x1e1b4b@0.70:boxborderw=10:enable='between(t\,0.3\,3)',scale=3840:2160,setsar=1,setpts=PTS/0.7" -c:v libx264 -crf 20 -preset medium -an "%SEGS%\08-outro-v3.mp4"
if %errorlevel% neq 0 (echo FAILED 08) else (echo [OK] 08-outro-v3.mp4)

echo.
echo ============================================
echo  Concatenating segments...
echo ============================================

(
echo file '01-landing-v3.mp4'
echo file '02-login-v3.mp4'
echo file '03-parent-hub-v3.mp4'
echo file '04-teacher-console-v3.mp4'
echo file '05-admin-center-v3.mp4'
echo file '06-enrolment-wizard-v3.mp4'
echo file '07-pdf-guide-v3.mp4'
echo file '08-outro-v3.mp4'
) > "%SEGS%\concat-v3.txt"

"%FF%" -y -f concat -safe 0 -i "%SEGS%\concat-v3.txt" -c copy "%SEGS%\..\kiddies-town-walkthrough-v3.mp4"
if %errorlevel% neq 0 (echo CONCAT FAILED) else (echo [OK] Final MP4 created)

echo.
echo ============================================
echo  Done! Output: presentation\kiddies-town-walkthrough-v3.mp4
echo ============================================
