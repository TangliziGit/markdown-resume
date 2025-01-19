mkdir pdf
mkdir md

for filename in $(ls pre-md | grep ".*\.md"); do
    sed -e "s/^===/<div><span>/g" \
        -e "s/===$/<\/span><\/div>/g" \
        -e "s/||/<\/span><span style='float: right'>/g" \
        -e "s/<>/<div class='line-breaker'><br><\/div>/g" \
        -e "s/<->/<div class='line-breaker-small'><br><\/div>/g" \
        pre-md/${filename} > md/${filename}
done

node index.js
