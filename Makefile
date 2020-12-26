deploy:
	git checkout trunk
	git add -A
	git commit -m "Deploy blog"
	
    # cp -r _site/ /tmp/
    # git checkout gh-pages
    # rm -r ./*
    # cp -r /tmp/_site/* ./
    # git add -A
    # git commit -m "Deploy blog"
    # git push origin gh-pages
    # git checkout trunk
    # echo "Deploy succeed"
