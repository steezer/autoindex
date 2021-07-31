window.util={
    getExtName(filename, defValue=""){
        if(filename.match(/\.\w+$/)){
            let index=filename.lastIndexOf('.');
            return filename.substr(index+1).toLowerCase();;
        }
        return defValue;
    },
    isImage(filename){
        let ext=this.getExtName(filename);
        let imgExts=['jpg', 'jpeg', 'gif', 'png', 'bmp'];
        return imgExts.indexOf(ext)!=-1;
    },
    getFileSize(size){
        if(size.match(/^\d+$/)){
            let sz=parseInt(size);
            if(sz>=1024){
                return (Math.round(sz/1024*100)/100)+'KB';
            }
            return sz+"B";
        }
        return size;
    },
    getParam(key, defValue){
        let href=window.location.href;
        let index=href.indexOf("?");
        if(index!=-1){
            let params=href.substr(index+1).split("&");
            let param={};
            params.forEach(e=>{
                let kv=e.split("=", 2);
                param[kv[0]]=kv[1]||'';
            })
            return param[key] || defValue;
        }
        return defValue;
    },
    loadImage(selector) {
        var imgs = document.querySelectorAll(selector);
        var clientHeight = window.innerHeight;
        Array.from(imgs).forEach(function(el){
            var bound = el.getBoundingClientRect();
            if(bound.top <= clientHeight && el.src!=el.dataset.src){
                var source = el.dataset.src;
                el.src = source;
            }
        })
    },
    getResult(baseDir, callback){
        $.get(baseDir, (res)=>{
            const titleRegx=/<title>Index\s+of\s+(.*?)<\/title>/;
            const contentRegx=/<pre>(.*?)<\/pre>/s;
            let rootDir=baseDir.replace(/\/+$/g, '');
            let title=res.match(titleRegx);
            let content=res.match(contentRegx);
            let files=[];
            if(content && title){
                content[1].split(/[\r\n]+/).forEach(e=>{
                    if(e!=""){
                        const regex=/<a.*?">(.*?)<\/a>/;
                        let name=e.match(regex)[1];
                        let content=e.replace(regex, "");
                        let attrs=content.split(/\s{2,}/);
                        if(attrs.length>1){
                            let isDir=attrs[2]=='-';
                            files.push({
                                isDir,
                                isImage: this.isImage(name),
                                name: isDir ? name.substr(0, name.length-1): name,
                                url: rootDir+"/"+name,
                                size: this.getFileSize(attrs[2]),
                                time: attrs[1]
                            });
                        }
                    }
                });
                callback({
                    rootDir,
                    title: title[1],
                    files
                });
            }
            callback({
                rootDir,
                title: "",
                files
            });
        });
    },
    createHtml(files, isList){
        let html="";
        files.forEach(e=>{
            if(isList){
                let nameHtml="";
                if(e.isDir){
                    nameHtml+='<a href="?dir='+e.url+'">';
                }else if(e.isImage){
                    nameHtml+='<a href="'+e.url+'" target="_blank">';
                }else{
                    nameHtml+='<a href="'+e.url+'" download="'+e.name+'">';
                }
                nameHtml+=e.name+"</a>";
                html+='<li><div class="info">';
                html+='<div class="name">'+nameHtml+'</div>';
                html+='<div class="time">'+e.time+'</div>';
                html+='<div class="size">'+e.size+'</div>';
                html+='</div></li>';
            }else{
                if(e.isDir){
                    html+='<a class="item" href="?dir='+e.url+'" title="Last modified: '+e.time+'">';
                    html+='<div class="thumb dir">'+util.getExtName(e.name)+'</div>';
                    html+='<div class="name">'+e.name+'</div>';
                    html+='</a>';
                }else if(e.isImage){
                    html+='<div class="item" data-url="'+e.url+'" title="Last modified: '+e.time+'&#10;File size: '+e.size+'">';
                    html+='<a target="_blank" href="'+e.url+'"><img class="thumb img" src="./images/loading.gif" data-src="'+e.url+'"/></a>';
                    html+='<div class="name">'+e.name+'</div>';
                    html+='</div>';
                }else{
                    html+='<a class="item" href="'+e.url+'" download="'+e.name+'" title="Last modified: '+e.time+'&#10;File size: '+e.size+'">';
                    html+='<div class="thumb file">'+util.getExtName(e.name)+'</div>';
                    html+='<div class="name">'+e.name+'</div>';
                    html+='</a>';
                }
            }
        });
        return isList ? "<ul>"+html+"</ul>" : html;
    },
    createGuide(rootDir){
        let arrays=rootDir.split('/');
        let urls=[];
        for(let i=0; i< arrays.length; i++){
            let name=arrays[i];
            let url=arrays.slice(0, i+1).join('/');
            if(name!=""){
                urls.push('<a href="?dir='+url+'">'+name+'</a>');
            }else{
                urls.push(name);
            }
        }
        return urls.join('/');
    }
}