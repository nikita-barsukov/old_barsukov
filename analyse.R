kommuner <- read.csv('denmark_foreigners_kommune.csv',sep=";",header=F)
land <- read.csv('denmark_foreigners_total.csv',sep=";",header=F)
colnames(kommuner) <- colnames(land) <- c('kommune','country','population')
land.ordered <- land[with(land, order(-population)), c(2,3)]
land.ordered$share <- round(land.ordered$population/sum(land.ordered$population),digits=6)
foreigners.kommune <- do.call(rbind, 
                              by(kommuner, kommuner$kommune, 
                                 function(x){c(sum(x[x$country != 'Danmark',c("population")])/sum(x$population),
                                               sum(x[x$country != 'Danmark',c("population")]),
                                               sum(x[x$country == 'Tyskland',c("population")]),
                                               sum(x[x$country == 'Tyrkiet',c("population")]),
                                               sum(x[x$country == 'Polen',c("population")]),
                                               sum(x[x$country == 'Irak',c("population")]),
                                               sum(x[x$country == 'Storbritannien',c("population")]),
                                               sum(x[x$country %in% c('Norge','Sverige','Finland','Island'),c("population")]),
                                               sum(x$population)
                                               )}))
foreigners.kommune <- data.frame(foreigners.kommune)
colnames(foreigners.kommune) <- c('share','total','Germany','Turkey','Poland','Iraq','UK','Nordics','population')
print(cor(foreigners.kommune$total, foreigners.kommune$population))
print(cor(foreigners.kommune$share, foreigners.kommune$population))
